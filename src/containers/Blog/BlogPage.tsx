import Post3nRow from "./Posts/3nRow";
import PostFacify from "./Posts/facify";
import style from "./Blog.module.scss";
import { AsideTableOfContents } from "./TableOfContents/TableOfContents";
import PostSolidDismiss from "./Posts/solid-dismiss";
import PostSolidPrimitives from "./Posts/solid-primitives";

const BlogPage = ({
  type,
}: {
  type:
    | "3nRow"
    | "facify"
    | "Solid Dismiss"
    | "Solid Primitives Website"
    | "HTML To SolidJSX";
}) => {
  const getPost = () => {
    switch (type) {
      case "3nRow":
        return <Post3nRow />;
      case "facify":
        return <PostFacify />;
      case "Solid Dismiss":
        return <PostSolidDismiss />;
      case "Solid Primitives Website":
        return <PostSolidPrimitives />;
    }
  };

  return (
    <div class={style["blog-page"]}>
      <div class={style["content"]}>
        <AsideTableOfContents />
        {getPost()}
      </div>
    </div>
  );
};

export default BlogPage;
