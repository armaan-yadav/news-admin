import JoditEditor from "jodit-react";
import { base_url } from "../config/config";
import { useContext } from "react";
import storeContext from "@/context/storeContext";

const Editor = ({ editor, description, setDescription }) => {
  const { store } = useContext(storeContext);
  return (
    <JoditEditor
      ref={editor}
      value={description}
      tabIndex={1}
      onBlur={(value) => setDescription(value)}
      config={{
        readonly: false,
        height: 400,
        uploader: {
          insertImageAsBase64URI: false,
          url: `${base_url}/api/images/jodit/add`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
          format: "json",
          isSuccess: function (resp) {
            console.log("isSuccess response:", resp);
            return resp && resp.files && resp.files.length > 0;
          },
          getMessage: function (resp) {
            return resp.msg || resp.message || "Upload completed";
          },
          process: function (resp) {
            console.log("Process response:", resp);

            return {
              files: resp.files || [],
              path: "",
              baseurl: "",
              error: resp.error || null,
              msg: resp.msg || resp.message || "",
            };
          },
          defaultHandlerSuccess: function (data, resp) {
            console.log("defaultHandlerSuccess called with:", data, resp);

            var i,
              field = "files";
            if (data[field] && data[field].length) {
              for (i = 0; i < data[field].length; i += 1) {
                // Insert image - data.baseurl + data.files[i]
                // Since your server returns full URLs, baseurl should be empty
                const imageUrl = (data.baseurl || "") + data[field][i];
                console.log("Inserting image:", imageUrl);
                this.s.insertImage(imageUrl);
              }
            }
          },
          error: function (e) {
            console.error("Upload error:", e);
            // Handle error display if needed
          },
        },
        buttons: [
          "source",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "eraser",
          "superscript",
          "subscript",
          "|",
          "ul",
          "ol",
          "indent",
          "outdent",
          "|",
          "left",
          "center",
          "right",
          "justify",
          "|",
          "font",
          "fontsize",
          "paragraph",
          "classSpan",
          "|",
          "brush",
          "cut",
          "copy",
          "paste",
          "|",
          "link",
          "unlink",
          "image",
          "file",
          "video",
          "table",
          "emoji",
          "symbols",
          "hr",
          "print",
          "|",
          "fullsize",
          "preview",
          "find",
          "selectall",
          "spellcheck",
          "copyformat",
          "|",
          "undo",
          "redo",
        ],

        image: {
          editSrc: true,
          preview: true,
          resize: true,
          width: "300px",
          height: "auto",
        },
      }}
      onChange={() => {}}
    />
  );
};

export default Editor;
