import LessonController from "@features/lessons/LessonController";

export default async function Page({ params }) {
  const { slug } = await params;

  return <LessonController slug={slug} />;
}