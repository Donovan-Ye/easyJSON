import useUserStore from "../../stores/userStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDaysLeft } from "@/lib/date";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Alert, AlertTitle } from "../ui/alert";
import { validateLicense } from "@/apis/license";
import { toastSucc } from "@/lib/utils";

const UserCheck: React.FC = () => {
  const { user, setUser, userCheckOpen, setUserCheckOpen } = useUserStore();
  const { t } = useTranslation();
  const [daysLeft, setDaysLeft] = useState(-1);
  const [licenseValid, setLicenseValid] = useState(true);

  const formSchema = z.object({
    email: z.string().email({ message: t("UserCheck.InvalidEmail") }),
    licenseCode: z
      .string()
      .min(0, { message: t("UserCheck.InvalidActivationCode") }),
  });

  useEffect(() => {
    if (user) {
      const email = user.email;
      const license = user.license;

      if (!email || !license) {
        const days = getDaysLeft(user.startDate);
        setDaysLeft(days);
        setUserCheckOpen(true);
      } else {
        if (email && license) {
          validateLicense({
            email,
            licenseCode: license,
            deviceId: user.uuid,
          }).catch(() => {
            setLicenseValid(false);
            setUserCheckOpen(true);
          });
        }
      }
    }
  }, [user]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      licenseCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;

    const license = await validateLicense({
      email: values.email,
      licenseCode: values.licenseCode,
      deviceId: user.uuid,
    });

    toastSucc(t("UserCheck.ActivationSuccess"));
    setUser({
      ...user,
      email: values.email,
      license: license.license,
    });
    setUserCheckOpen(false);
  }

  return (
    <Dialog open={userCheckOpen} onOpenChange={setUserCheckOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("UserCheck.ThankYou")}</DialogTitle>
          <DialogDescription className="flex flex-col gap-4">
            <div>
              {licenseValid
                ? t("UserCheck.Trail", { days: daysLeft })
                : t("UserCheck.InvalidLicense")}
            </div>

            <div>
              <Form {...form}>
                <form className="space-y-8">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("UserCheck.Email")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("UserCheck.EmailPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="licenseCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("UserCheck.ActivationCode")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "UserCheck.ActivationCodePlaceholder"
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>

            <Alert className="p-2 text-xs flex items-center">
              <AlertTitle>{t("UserCheck.ActivationHint")}</AlertTitle>
            </Alert>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>{t("UserCheck.Buy")}</Button>
          <Button
            variant="outline"
            onClick={() => {
              form.handleSubmit(onSubmit)();
            }}
          >
            {t("UserCheck.Activate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserCheck;
