export default function CanvasBottomText({
  message,
  isMessageLoading,
}: {
  message: string;
  isMessageLoading: boolean;
}) {
  if (!message) return null;

  return (
    <div>
      <p>오직 영어로만 답변이 가능합니다</p>
      <p>{isMessageLoading ? "전송중..." : message}</p>
      <div>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md">
          게시판에 업로드 하기
        </button>
      </div>
    </div>
  );
}
