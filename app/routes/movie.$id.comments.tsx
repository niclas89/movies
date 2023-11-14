import {
  Form,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { LoaderArgs, json, ActionArgs } from "@remix-run/node";
import { db } from "~/utils/db.server";

export async function loader({ params }: LoaderArgs) {
  console.log("loader called");
  const data = await db.comment.findMany({
    where: {
      movieId: params.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return json({ data });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const data = await db.comment.create({
    data: {
      message: formData.get("comment") as string,
      movieId: formData.get("id") as string,
    },
  });

  return json({ data });
}

export default function Comments() {
  const { id } = useParams();
  const { data } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  return (
    <div className="rounded-lg border p3">
      <h1 className="text-xl font-semibold mb-5">Your Opinion</h1>
      <div>
        <Form method="POST">
          <textarea
            name="comment"
            className="w-full border border-teal-500 rounded-lg p-2 "
          ></textarea>
          <input type="hidden" name="id" value={id} />
          {navigation.state === "submitting" ? (
            <button
              type="submit"
              disabled
              className="bg-teal-500 px-4 py-2 rounded-lg text-white"
            >
              Loading...
            </button>
          ) : (
            <button
              type="submit"
              className="bg-teal-500 px-4 py-2 rounded-lg text-white"
            >
              Comment
            </button>
          )}
        </Form>
        <div className="mt-5 flex flex-col gay-y-3">
          '
          {data.map((post) => (
            <div key={post.id}>
              <p>{post.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
