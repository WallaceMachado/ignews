import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { RichText } from "prismic-dom";

import { getPrismicClient } from "../../services/primisc";

import styles from "./post.module.scss";

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
        </article>
      </main>
    </>
  );
}

//paginas staticas nãos]ao protegidas, todos vão ter acesso a elas 
//por isso será dinamica
export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  // buscar cookies para checar se usuário está logado
  const session = await getSession({ req });


  // guardar slug
  const { slug } = params;

   // direciona para home caso não esteja logado
   if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false,
      }
    }
  }


  // cliente do prismic
  const prismic = getPrismicClient(req);

  // buscar pelo slug
  const response = await prismic.getByUID("publication", String(slug), {});

  // formatação dos dados
  const post = {
    slug,
    title: response.data.title,
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: {
      post,
    },
  };

  // se usuário não estiver logado
  // if (!session){
  // }
};