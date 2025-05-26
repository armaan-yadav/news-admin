import newsServices from "@/services/newsServices";
import { SplitButton } from "primereact/splitbutton";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ActionButton({ newsId, token }) {
  const toast = useRef(null);
  const navigate = useNavigate();
  const items = [
    {
      label: "Delete",
      icon: "pi pi-times",
      command: async () => {
        const res = await newsServices.deleteNews(newsId, token);
        console.log(res);
      },
    },
  ];

  const save = () => {
    navigate(`/dashboard/news/edit/${newsId}`);
  };

  return (
    <div className="card flex justify-content-center">
      <Toast ref={toast}></Toast>
      <SplitButton
        label="Edit"
        size="small"
        className="text-sm"
        icon="pi pi-file-edit"
        dropdownIcon="pi pi-ellipsis-h"
        onClick={save}
        model={items}
      />
    </div>
  );
}
