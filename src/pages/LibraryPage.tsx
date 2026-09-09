import { DragDropContentUploader } from "../components/trainer/DragDropContentUploader";
import { PageTitle } from "../components/ui/PageTitle";
export function LibraryPage() {
  return (
    <>
      <PageTitle
        title="Content library"
        desc="Bring your knowledge into the learning experience."
      />
      <DragDropContentUploader />
    </>
  );
}
