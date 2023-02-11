import { FormEvent, useState } from "react";
import { Button } from "ui";
import { api, RouterOutputs } from "~/libs/trpc/trpc";
import { useAuthControl, useAuthUser } from "~/modules/auth/contexts";

const LoginButton = (): JSX.Element => {

  const {signInWithGoogle, signOut} = useAuthControl();
  const auth = useAuthUser();

  if(auth.authUser) {
    return (
      <button type="button" onClick={signOut}>
        sign out
      </button>
    )
  }

  return (
    <button type="button" onClick={signInWithGoogle} >
      Login
    </button>
  );
};


type FormProps = {
  data: Exclude<RouterOutputs['post']['byId'], null>
}

export const Form = ({data}: FormProps): JSX.Element => {
  const [title, setTitle] = useState(data.title);
  const [isEdit, setIsEdit] = useState(false);
  const utils = api.useContext();

  const mutation = api.post.update.useMutation({
    onSuccess: (res) => {
      utils.post.byId.setData({id: res.id}, (prev) => ({...prev, ...res}));
      utils.post.all.setData(undefined, (prev) => {
        // immutableになってるかも！？
        if(prev) {
          prev[0].title = res.title
        }
        return prev
      })
    }
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();
    e.stopPropagation();

    mutation.mutate({id: data.id, title});
  }

  console.log('error', mutation.error)

  return (
    <div>
      <div>
        <h4>title</h4>
        {data.title}
        <button type="button" onClick={() => setIsEdit(!isEdit)}>edit</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
        <button type="submit">submit</button>
        {mutation.isLoading ? <p>loading...</p> : null}
      </form>
    </div>
  );
};


export default function Web(): JSX.Element {

  const [selectedId, setSelectedId] = useState<string>()

  const singleResult = api.post.byId.useQuery({id: selectedId ?? ''}, {
    enabled: selectedId !== undefined
  });
  const listResult = api.post.all.useQuery();

  if(!listResult.data){
    return <>loading</>
  }

  return (
    <div>
      <LoginButton />
      <div style={{display: 'flex'}}>
        <ul>
          {listResult.data.map(({id, title}) =>
            <li key={id} onClick={() => setSelectedId(id)}>
              <div>{id}</div>
              <div>{title}</div>
            </li>
          )}
        </ul>
        <div>
          {singleResult.data ? <Form data={singleResult.data} /> : <>{JSON.stringify(selectedId)}</>}
        </div>
      </div>
    </div>
  );
}
