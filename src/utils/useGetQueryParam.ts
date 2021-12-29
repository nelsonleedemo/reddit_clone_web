import { useRouter } from "next/router";

// 10:58:43 exercise: make it generic taht works for any query parameters
export const useGetQueryParam = (
  field: string,
  type: "string" | "number" | "boolean"
) => {
  const router = useRouter();
  if (type === "number") {
    return typeof router.query[field] === "string"
      ? parseInt(router.query[field] as string)
      : -1;
  } else if (type === "boolean") {
    return !!router.query[field];
  } else {
    return router.query[field];
  }
};
