// ============================================================
// GraphQL Queries — aconymous.com
// Semua query ke WPGraphQL dikumpulin di sini biar gampang
// kalau mau extend atau debug. No spaghetti, please.
// ============================================================

export const GET_ALL_POSTS = `
  query GetAllPosts($first: Int = 10) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        date
        modified
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: String!) {
    postBy(slug: $slug) {
      id
      databaseId
      title
      content
      excerpt
      date
      modified
      slug
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }
      author {
        node {
          name
          slug
          description
          avatar {
            url
          }
        }
      }
      comments(first: 50, where: { status: "APPROVE", orderby: COMMENT_DATE }) {
        nodes {
          id
          date
          content
          parentId
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_POST_SLUGS = `
  query GetAllPostSlugs {
    posts(first: 100, where: { status: PUBLISH }) {
      nodes {
        slug
      }
    }
  }
`;

// Query untuk related posts berdasarkan kategori
export const GET_RELATED_POSTS = `
  query GetRelatedPosts($categorySlug: String!, $excludeId: ID!, $first: Int = 4) {
    posts(
      first: $first
      where: {
        status: PUBLISH
        categoryName: $categorySlug
        notIn: [$excludeId]
      }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        date
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;