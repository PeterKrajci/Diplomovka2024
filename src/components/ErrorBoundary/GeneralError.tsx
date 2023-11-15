import { FC } from "react";

import { Page } from "../Page/Page";
import { Button, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Text } = Typography;

const refreshPage = () => {
  window.location.reload();
};

export const GeneralError: FC = () => {
  return (
    <Page>
      <div className="flex h-screen items-center justify-center">
        <div className="grid justify-center justify-items-center gap-2.5">
          <Text className="text-5xl font-semibold">
            {"Something went wrong"}
          </Text>
          <Text className="mb-8 text-center text-lg font-semibold">
            {"Try to refresh the page."}
          </Text>
          <Button icon={<ReloadOutlined />} onClick={refreshPage}>
            {"Refresh"}
          </Button>
        </div>
      </div>
    </Page>
  );
};
