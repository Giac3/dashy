import SimpleCodeEditor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-plsql";
import "prismjs/themes/prism-okaidia.css";

const Editor = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
}) => {
  return (
    <div className="rounded border-[1px] border-border bg-surface min-h-32 w-full h-full overflow-y-scroll">
      <SimpleCodeEditor
        value={value}
        placeholder={placeholder}
        onValueChange={onChange}
        highlight={(code) => highlight(code, languages.plsql, "plsql")}
        padding={10}
      />
    </div>
  );
};

export { Editor };
