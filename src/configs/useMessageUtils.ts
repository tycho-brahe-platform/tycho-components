import { TFunction } from "i18next";
import { useContext } from "react";
import { message, silentLoading, toastLoading } from "../configs/store/actions";
import CommonContext from "./CommonContext";

type MessageDispatcher = {
  key: string;
  ns?: string;
  t: TFunction;
};

type ErrorDispatcher = {
  err: any;
  t?: TFunction;
  key?: string;
};

export const useMessageUtils = () => {
  const { state, dispatch } = useContext(CommonContext);

  const isSilentLoading = () => {
    return state.silentLoading;
  };

  const dispatchSilent = (val: boolean) => {
    dispatch(silentLoading(val));
  };

  const isLoading = () => {
    return state.toastLoading;
  };

  const dispatchLoading = (val: boolean, text?: string) => {
    dispatch(
      text !== undefined
        ? toastLoading({ loading: val, text })
        : toastLoading(val),
    );
  };

  const dispatchError = ({ err, t, key }: ErrorDispatcher) => {
    if (!t) {
      dispatch(message({ value: err as string, type: "error" }));
      return;
    }

    if (!err.response) {
      const value = t(`${key ?? "message"}:${err}`);
      dispatch(message({ value, type: "error" }));
      return;
    }

    if (err.response.status === 403) {
      dispatch(
        message({ value: t("error.access.authorization"), type: "error" }),
      );
      return;
    }

    let errorKey = "";
    if (err.response.data?.message) {
      errorKey = err.response.data.message;
    } else if (err.response.data?.description) {
      errorKey = err.response.data.description;
    } else if (err.response.data?.errors?.length > 0) {
      errorKey = err.response.data.errors[0].description;
    } else {
      key = "common";
      errorKey = "internal.server.error";
    }

    const value = t(`${key ?? "message"}:${errorKey}`);
    dispatch(message({ value, type: "error" }));
  };

  const dispatchMessage = ({ key, ns, t }: MessageDispatcher) => {
    const entry = ns ? `${ns}:${key}` : `message:${key}`;
    dispatch(message({ value: t(entry), type: "success" }));
  };

  const dispatchMessageDirect = (
    value: string,
    type: "success" | "error" = "success",
  ) => {
    dispatch(message({ value, type }));
  };

  return {
    dispatchLoading,
    dispatchError,
    dispatchMessage,
    dispatchMessageDirect,
    isLoading,
    dispatchSilent,
    isSilentLoading,
  };
};
