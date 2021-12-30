import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../../../components/InputField";
import Layout from "../../../components/Layout";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useGetQueryParam } from "../../../utils/useGetQueryParam";
import { useIsAuth } from "../../../utils/useIsAuth";

const EditPost: React.FC<{}> = ({}) => {
  const router = useRouter();
  const intId = useGetQueryParam("id", "number") as number;

  /*
    Urql will update the cache after receving response from server that updated the post
  */

  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [, updatePost] = useUpdatePostMutation();
  useIsAuth();
  if (fetching) return <Layout>Loading...</Layout>;
  if (!data?.post)
    return (
      <Layout>
        <Box>Could not find post</Box>
      </Layout>
    );

  return (
    <Layout varient="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          //   const { error } = await createPost({ input: values });
          //   if (!error) {
          //     router.push("/");
          //   }
          await updatePost({ updatePostId: intId, ...values });
          //   router.push("/");
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>

            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              loadingText="Submitting"
              colorScheme="teal"
            >
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
