import { usePostQuery } from "../generated/graphql";
import { useGetQueryParam } from "./useGetQueryParam";

export const useGetPostFromUrl = () => {
  const intId = useGetQueryParam("id", "number") as number;

  return usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
};
