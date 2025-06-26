import { TabsContent } from "../ui/tabs";

interface TabViewProps {
  viewMode: string;
  children: React.ReactNode;
}
const TabView: React.FC<TabViewProps> = ({ viewMode, children }) => {
  // `data-[state=inactive]` used for fix https://github.com/radix-ui/primitives/issues/1155#issuecomment-2041571341
  return (
    <TabsContent
      value={viewMode}
      className="relative w-full h-full m-0 data-[state=inactive]:hidden"
      forceMount
    >
      {children}
    </TabsContent>
  );
};

export default TabView;
