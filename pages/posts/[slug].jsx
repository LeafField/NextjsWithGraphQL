import { GraphQLClient, gql } from "graphql-request";
import styles from "../../styles/slug.module.css";
import Link from "next/link";

const graphcms = new GraphQLClient(
  "https://api-ap-northeast-1.hygraph.com/v2/cla9klq8r23iw01um3b9j3rig/master"
);

const QUERY = gql`
  query post($slug: String!) {
    post(where: { slug: $slug }) {
      id
      slug
      title
      content {
        html
      }
      datePublished
      photo {
        id
        url
      }
    }
  }
`;

const SLUGLIST = gql`
  {
    posts {
      slug
    }
  }
`;

export const getStaticPaths = async () => {
  const { posts } = await graphcms.request(SLUGLIST);
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const slug = params.slug;
  const data = await graphcms.request(QUERY, { slug });
  const post = data.post;
  return {
    props: {
      post,
    },
  };
};

export default function Home({ post }) {
  return (
    <main className={styles.blog}>
      <h2>{post.title}</h2>
      <img src={post.photo.url} alt="" className={styles.photo} />
      <div className={styles.title}>
        <h6 className={styles.date}>{post.datePublished}</h6>
      </div>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content.html }}
      />
      <div className={styles.backBtton}>
        <Link href="/">
          <span>←戻る</span>
        </Link>
      </div>
    </main>
  );
}
