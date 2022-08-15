import Head from "next/head";
import styles from "./styles.module.scss";
import Prismic from "@prismicio/client";

import { getPrismicClient } from "../../services/primisc";
import { GetStaticProps } from "next";
import { RichText } from "prismic-dom";// yarn add prismic-dom para formatar retorno do prismic
import Link from "next/link";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>12 de março de 2022</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspace</strong>
            <p>
              In this guide, you will learn how to create a Monorepo to manage
              multiple packages with a shared build, test, and release process.
            </p>
          </a>
          <a href="#">
            <time>12 de março de 2022</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspace</strong>
            <p>
              In this guide, you will learn how to create a Monorepo to manage
              multiple packages with a shared build, test, and release process.
            </p>
          </a>
          <a href="#">
            <time>12 de março de 2022</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspace</strong>
            <p>
              In this guide, you will learn how to create a Monorepo to manage
              multiple packages with a shared build, test, and release process.
            </p>
          </a>
          {posts.map((post) => (
              <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

// página estática -> menos consumo de banda
export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at("document.type", "publication")],
    {
      fetch: ["publication.title", "publication.content"],
      pageSize: 100,
    }
  );
  //console.log(JSON.stringify(response, null, 2));
  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
     //  title: RichText.asText(post.data.title),
      title: post.data.title,
      excerpt:
        post.data.content.find((content) => content.type === "paragraph")
          ?.text ?? "",
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return {
    props: {posts},
  };
};