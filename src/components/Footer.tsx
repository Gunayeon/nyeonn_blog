import { Link } from "react-router-dom";
import { BsSun, BsMoonFill } from "react-icons/bs";
import { JSX, useContext } from "react";
import ThemeContext from "context/ThemeContext";

export default function Footer() {
  const context = useContext(ThemeContext);
  console.log(context);

  const SunIcon = BsSun as unknown as (props: any) => JSX.Element;
  const MoonIcon = BsMoonFill as unknown as (props: any) => JSX.Element;
  return (
    <footer>
      <Link to="/posts/new">글쓰기</Link>
      <Link to="/posts">게시글</Link>
      <Link to="/profile">프로필</Link>
      <>
      {context.theme === "light" ? (
        <SunIcon onClick={context.toggleMode} className="footer__theme-btn" />
        ) : (
        <MoonIcon onClick={context.toggleMode} className="footer__theme-btn" />
        )}
      </>
    </footer>
  );
}