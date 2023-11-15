import { FC, ReactNode } from "react";
import { BackButton } from "./elements/BackButton";
import { cx } from "../../utils/classNames";

type Props = {
  children: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
  isHeaderSticky?: boolean;
  headerContent?: ReactNode;
  backButton?: string | boolean;
};

export const Page: FC<Props> = ({
  children,
  title,
  actions,
  isHeaderSticky,
  headerContent,
  backButton,
}) => {
  return (
    <>
      {(title || actions) && (
        <div
          className={cx(
            "border-b border-gray-50 bg-white p-6 lg:rounded-tl-2xl",
            isHeaderSticky && "sticky top-[70px] z-10"
          )}
          id="pageHeader"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {backButton && title && (
                <BackButton
                  backButtonRoute={
                    typeof backButton === "string" ? backButton : undefined
                  }
                />
              )}
              <h1>{"TITLE"}</h1>
            </div>
            {actions && (
              <div className="flex items-center gap-3">{actions}</div>
            )}
          </div>
          {headerContent && <div className="mt-4">{headerContent}</div>}
        </div>
      )}
      <div className="min-h-layout bg-gray-10 p-6">{children}</div>
    </>
  );
};
