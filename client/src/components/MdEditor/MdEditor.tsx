"use client";

import MDEditor from "@uiw/react-md-editor";
import { Dispatch, SetStateAction } from "react";
import rehypeSanitize from "rehype-sanitize";

type MarkdownEditorProps = {
  labelText?: string;
  value: string | undefined;
  setValue: Dispatch<SetStateAction<string | undefined>>;
  textAreaName?: string;
  disabled?: boolean;
};

export function MarkdownEditor({
  value,
  setValue,
  disabled,
}: MarkdownEditorProps) {

    const themeMode = localStorage.getItem("theme")

  return (
    <div data-color-mode={themeMode} className="w-full space-y-3">
      <MDEditor
        value={value}
        onChange={(val) => setValue(val)}
        preview="edit"
        height={400}
        visibleDragbar={false}
        textareaProps={{ disabled }}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
    </div>
  );
}
