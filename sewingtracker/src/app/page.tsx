import styles from "./page.module.css";
import TagList from "./components/TagList";
import ProjectsList from "./components/ProjectsList";
import Search from "./components/Search";

export default function Home() {
  return (
    <>
    <body>
      <section>      
        <h1>Welcome to Sewing Tracker</h1>
        <TagList />
      </section>
      <section>
        <Search />
        <button className="new-project">+</button>
      </section>
      <section>
        <h2>Projects</h2>
        <ProjectsList />
      </section>

    </body>
    </>
  );
}