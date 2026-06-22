"use client";

const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      // className="
      //   flex
      //   flex-col
      //   gap-3
      //   m-auto
      //   my-5
      //   md:mx-0
      //   prose
      //   prose-ul:list-square
      //   prose-ol:m-0
      //   prose-ul:m-0
      //   prose-li:m-0
      //   prose-a:no-underline
      //   prose-img:m-0
      //   
      //   prose-blockquote:border-amber-500
      //   dark:prose-blockquote:border-amber-700
      //   dark:prose-a:border-amber-700
      //   dark:[&>div>a>div>*]:text-white
      //   dark:[&>div>a>div>div>*]:text-gray-500
      //   "

      // className="prose"
    >
      {children}
    </div>
  );
};

export default ContentWrapper;
