import { useEffect, type ComponentPropsWithoutRef } from "react";
import { EditorWrapper, type Kind } from "@/lib/editor/editor";
import { useStatusStore } from "@/stores/statusStore";
import { getTree } from "@/stores/treeStore";
import { Editor } from "@monaco-editor/react";
import { useShallow } from "zustand/shallow";
import { useEditorStore, useEditor } from "@/stores/editorStore";
import Loading from "../Loading";
import useThemeStore from "@/stores/themeStore";
import { Theme } from "@/types/context";
import { initMonacoConfig } from "./config";
// import { isDev } from "@/lib/env";
import { readText } from "@tauri-apps/plugin-clipboard-manager";
import { validateJson } from "@/lib/editor/json";
import useUserStore from "@/stores/userStore";
import { isDev } from "@/lib/env";

initMonacoConfig();

interface EditorProps extends ComponentPropsWithoutRef<typeof Editor> {
  kind: Kind;
}

export default function MonacoEditor({ kind, ...props }: EditorProps) {
  const { theme } = useThemeStore(
    useShallow((state) => ({
      theme: state.theme,
    }))
  );
  const setEditor = useEditorStore((state) => state.setEditor);

  useDisplayExample();
  useRevealNode();

  return (
    <Editor
      language="json"
      theme={theme === Theme.DARK ? "vs-dark" : "vs"}
      loading={<Loading />}
      options={{
        fontSize: 12, // 设置初始字体大小
        scrollBeyondLastLine: false, // 行数超过一屏时才展示滚动条
        automaticLayout: true, // 当编辑器所在的父容器的大小改变时，编辑器会自动重新计算并调整大小
        wordWrap: "on",
        minimap: { enabled: false },
        stickyScroll: {
          enabled: true,
          defaultModel: "foldingProviderModel",
        },
      }}
      onMount={(editor, monaco) => {
        if (!window.monacoApi) {
          window.monacoApi = {
            KeyCode: monaco.KeyCode,
            MinimapPosition: monaco.editor.MinimapPosition,
            OverviewRulerLane: monaco.editor.OverviewRulerLane,
            Range: monaco.Range,
            RangeFromPositions: monaco.Range.fromPositions,
          };
        }
        // used for e2e tests.
        window.monacoApi[kind] = editor;

        const wrapper = new EditorWrapper(editor, kind);
        wrapper.init();
        setEditor(wrapper);
        console.l(`finished initial editor ${kind}:`, wrapper);
      }}
      {...props}
    />
  );
}

// reveal position in text
export function useRevealNode() {
  const editor = useEditor("main");
  const { isNeedReveal, revealPosition } = useStatusStore(
    useShallow((state) => ({
      isNeedReveal: state.isNeedReveal("editor"),
      revealPosition: state.revealPosition,
    }))
  );

  useEffect(() => {
    const { treeNodeId, type } = revealPosition;

    if (editor && isNeedReveal && treeNodeId) {
      const node = getTree().node(treeNodeId);
      if (node) {
        editor.revealOffset(
          (type === "key" ? node.boundOffset : node.offset) + 1
        );
      }
    }
  }, [editor, revealPosition, isNeedReveal]);
}

const exampleData = `{
  "多语言用户数据": {
      "基本信息": {
          "姓名": "张三",
          "年龄": 28,
          "languages": ["中文", "English", "日本語"],
          "学历": [
              {
                  "学校": "北京大学",
                  "专业": "计算机科学",
                  "年份": 2018
              },
              {
                  "学校": "Tokyo University",
                  "専攻": "情報工学",
                  "年度": 2020
              }
          ]
      },
      "工作经历": [
          {
              "公司": "テック株式会社",
              "职位": ["ソフトウェアエンジニア", "プロジェクトリーダー"],
              "期間": "2020-2022",
              "プロジェクト": [
                  "AI開発",
                  "クラウドシステム"
              ]
          },
          {
              "company": "Global Tech Ltd",
              "positions": ["Senior Developer", "Team Lead"],
              "projects": {
                  "main": "Cloud Migration",
                  "side": ["API Development", "Security Audit"]
              }
          }
      ],
      "技能评估": {
          "编程语言": {
              "Python": 95,
              "JavaScript": 90,
              "Java": 85
          },
          "frameworks": [
              {"React": "精通"},
              {"Vue": "熟练"},
              {"Angular": "良好"}
          ],
          "证书": [
              {
                  "name": "AWS Certified Solutions Architect",
                  "取得日期": "2023-01-15",
                  "スコア": 920
              }
          ]
      },
      "个人项目": [
          {
              "名称": "多语言AI助手",
              "技术栈": ["Python", "React", "OpenAI"],
              "特徴": [
                  "自然言語処理",
                  "実時間翻訳",
                  "音声認識"
              ]
          }
      ]
  },
  "システム設定": {
      "表示言語": ["自動", "中文", "English", "日本語"],
      "テーマ": {
          "現在": "ダーク",
          "自動切換": true,
          "カスタム": {
              "背景": "#1a1a1a",
              "文字": "#ffffff"
          }
      },
      "通知設定": [
          {
              "type": "email",
              "enabled": true,
              "頻度": "毎日"
          },
          {
              "类型": "应用推送",
              "启用": false,
              "frequency": "weekly"
          }
      ]
  }
}`;

function useDisplayExample() {
  const editor = useEditor("main");
  const incrEditorInitCount = useStatusStore(
    (state) => state.incrEditorInitCount
  );
  const { settings } = useUserStore(
    useShallow((state) => ({
      settings: state.settings,
    }))
  );

  const readFromClipboard = async () => {
    if (!settings.autoPaste || editor?.text()?.trim()?.length) {
      return;
    }

    const text = await readText();

    if (validateJson(text)) {
      editor?.parseAndSet(text);
    }
  };

  useEffect(() => {
    if (editor) {
      editor.editor.onDidFocusEditorWidget(() => {
        readFromClipboard();
      });

      if (isDev) {
        editor.parseAndSet(exampleData);
      }

      if (incrEditorInitCount() <= 1) {
        editor.parseAndSet(exampleData);
      } else {
        readFromClipboard();
      }
    }
  }, [editor]);
}
