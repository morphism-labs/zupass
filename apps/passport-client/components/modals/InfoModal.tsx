import { appConfig } from "../../src/appConfig";
import { CenterColumn, Spacer, TextCenter } from "../core";
import { icons } from "../icons";

export function InfoModal() {
  return (
    <div>
      <Spacer h={32} />
      <TextCenter>
        <img src={icons.infoPrimary} width={34} height={34} />
      </TextCenter>
      <Spacer h={32} />
      <CenterColumn w={240}>
        {appConfig.isZuzalu ? <ZuzaluContent /> : <PCDpassContent />}
      </CenterColumn>
    </div>
  );
}

function ZuzaluContent() {
  return (
    <>
      <TextCenter>
        The Zuzalu Passport is a product of 0xPARC. For app support, contact{" "}
        <a href="mailto:passport@0xparc.org">passport@0xparc.org</a>.
      </TextCenter>
      <Spacer h={16} />
      <TextCenter>
        For event or venue support, contact{" "}
        <a href="mailto:support@zuzalu.org">support@zuzalu.org</a>.
      </TextCenter>
    </>
  );
}

function PCDpassContent() {
  return (
    <>
      <TextCenter>
        PCDpass is a product of 0xPARC. For app support, contact{" "}
        <a href="mailto:passport@0xparc.org">passport@0xparc.org</a>.
      </TextCenter>
    </>
  );
}
