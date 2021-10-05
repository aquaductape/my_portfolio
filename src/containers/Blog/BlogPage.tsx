import Post3nRow from "./Posts/3nRow";
import PostFacify from "./Posts/facify";
import style from "./Blog.module.scss";
import { AsideTableOfContents } from "./TableOfContents/TableOfContents";
import PostSolidDismiss from "./Posts/solid-dismiss";

const BlogPage = ({ type }: { type: "3nRow" | "facify" | "Solid Dismiss" }) => {
  const getPost = () => {
    switch (type) {
      case "3nRow":
        return <Post3nRow></Post3nRow>;
      case "facify":
        return <PostFacify></PostFacify>;
      case "Solid Dismiss":
        return <PostSolidDismiss></PostSolidDismiss>;
    }
  };

  return (
    <div class={style["blog-page"]}>
      <div class={style["content"]}>
        <AsideTableOfContents></AsideTableOfContents>
        {getPost()}
      </div>
    </div>
  );
};

export default BlogPage;
