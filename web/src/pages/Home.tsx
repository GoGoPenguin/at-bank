import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useApi from "../hooks/use-api.hook";
import { useAuthStore } from "../store/use-auth.store";
import {
  USER_TYPE_ATHLETIC_TRAINER,
  USER_TYPE_DEPARTMENT,
} from "../types/user.type";
import AthleticTrainerHome from "./AthleticTrainerHome";
import DepartmentHome from "./DepartmentHome";

function Home() {
  const { user, setUser } = useAuthStore();
  const { getMe } = useApi();
  const { data: resp, isSuccess } = useQuery({
    queryKey: ["getMe"],
    queryFn: getMe,
  });

  useEffect(() => {
    if (isSuccess) {
      setUser(resp);
    }
  }, [isSuccess, resp, setUser]);

  return (resp ?? user)?.type === USER_TYPE_ATHLETIC_TRAINER ? (
    <AthleticTrainerHome />
  ) : (resp ?? user)?.type === USER_TYPE_DEPARTMENT ? (
    <DepartmentHome />
  ) : null;
}

export default Home;
