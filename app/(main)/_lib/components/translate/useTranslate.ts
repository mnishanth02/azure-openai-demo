import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { TranslateFormType } from "../../schema";
import { translate } from "./translate-action";

export const useTranslate = () => {
  const mutation = useMutation<any, Error, TranslateFormType>({
    mutationFn: translate,
    onSuccess: (data: any) => {
      toast.success("Translation successfull");
    },
    onError: () => {
      toast.success("Error while translating");
    },
  });

  return mutation;
};
