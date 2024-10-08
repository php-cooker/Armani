/* eslint-disable @next/next/no-img-element */
"use client";
import * as React from "react";
import {
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  CheckIcon,
  XMarkIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import { get, debounce, isEmpty } from "lodash";
// @ts-ignore
import EasyEdit, { Types } from "react-easy-edit";
import { LinkedinIcon } from "lucide-react";
import { useEditorWidgetObserveable } from "@/hooks/useEditorWidgetsObserveable";
import {
  useEditorObserveable,
  useObservable,
  useSelectedWidgetRepo,
} from "@/store";
import useDebounce from "@/hooks/useDeepCompareMemoize";
import { BasicInput } from "../basic-input";
import { EditTextDisplay } from "../EditText";

export type ContactCardProps = {
  data: any;
  handleOnSave?: (data: any) => void;
};

function Icon({ id, open }: { id: number; open: boolean }) {
  return (
    <>
      <ChevronDownIcon
        key={id}
        strokeWidth={2.5}
        className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
      />
    </>
  );
}

export const ContactCardEdit = ({ data }: ContactCardProps) => {
  // state
  const [expandBio, setExpandBio] = React.useState(false);
  const [expandContact, setExpandContact] = React.useState(false);
  const [title, setTitle] = React.useState(
    data?.data?.contactData?.title || "Title"
  );
  const [subtitle, setSubtitle] = React.useState(
    data?.data?.contactData?.subtitle || "Subtitle"
  );
  const [bio, setBio] = React.useState(data?.data?.contactData?.bio || "");
  const [email, setEmail] = React.useState(
    data?.data?.contactData?.email || "Email"
  );
  const [linkedin, setLinkedin] = React.useState(
    data?.data?.contactData?.linkedin || "Linkedin"
  );
  const [phone, setPhone] = React.useState(
    data?.data?.contactData?.phone || "Phone"
  );

  const [saveData, setSaveData] = React.useState(false);
  const debouncedSaveData = useDebounce(saveData, 500);

  // state
  const editorObs$ = useEditorObserveable();
  const selectedWidgetRepo = useSelectedWidgetRepo();
  const selectedWidgetState = useObservable(selectedWidgetRepo.getObservable());
  const editorWidgetState = useEditorWidgetObserveable(
    selectedWidgetState.widgetId
  );

  console.log("selectedWidgetState", selectedWidgetState);
  console.log("editorWidgetState", editorWidgetState);
  const widgetData = get(data, "data.contactData", {});
  const imgUrl = get(
    data,
    "data.images.url",
    "https://images.unsplash.com/photo-1460472178825-e5240623afd5?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 150w"
  );

  React.useEffect(() => {
    setSaveData(true);
  }, [phone, email, linkedin]);

  const cancel = () => {};

  const handleOnSaveData = React.useCallback(() => {
    if (!isEmpty(editorWidgetState)) {
      editorObs$.updateWidget(data.id, {
        ...editorWidgetState,
        data: {
          ...(editorWidgetState && editorWidgetState.data),
          contactData: {
            title,
            subtitle,
            bio,
            email,
            linkedin,
            phone,
          },
        },
      });
    }
  }, [
    bio,
    data.id,
    editorObs$,
    editorWidgetState,
    email,
    linkedin,
    phone,
    subtitle,
    title,
  ]);

  React.useEffect(() => {
    if (debouncedSaveData) {
      handleOnSaveData();
      setSaveData(false);
    }
  }, [debouncedSaveData, handleOnSaveData]);

  return (
    <div className="flex flex-col flex-grow w-full">
      <div className="flex justify-center items-center h-32">
        <img src={imgUrl} alt="contact" className="h-32 w-32" />
      </div>
      <div className="flex flex-col justify-center items-center">
        <EasyEdit
          type={Types.TEXT}
          onSave={(value: any) => {
            setTitle(value);
            setSaveData(true);
          }}
          onCancel={cancel}
          attributes={{ name: "awesome-input", id: 1 }}
          value={widgetData.title || "Title"}
          displayComponent={<EditTextDisplay variant="h6" />}
          saveButtonLabel={<CheckIcon className="h-4 w-4" />}
          cancelButtonLabel={<XMarkIcon className="h-4 w-4" />}
        />
        <EasyEdit
          type={Types.TEXT}
          onSave={(value: any) => {
            setSubtitle(value);
            setSaveData(true);
          }}
          onCancel={cancel}
          attributes={{ name: "awesome-input", id: 1 }}
          value={widgetData.subtitle || "Subtitle"}
          displayComponent={<EditTextDisplay variant="small" />}
          saveButtonLabel={<CheckIcon className="h-4 w-4" />}
          cancelButtonLabel={<XMarkIcon className="h-4 w-4" />}
        />
      </div>
      <div className="flex flex-col px-3 m-w-[200px]">
        <Accordion open={expandBio} icon={<Icon id={1} open={expandBio} />}>
          <AccordionHeader
            onClick={() => {
              setExpandBio(!expandBio);
            }}
          >
            Bio
          </AccordionHeader>
          <AccordionBody className="flex-wrap text-wrap">
            <EasyEdit
              type={Types.TEXT}
              onSave={(value: any) => {
                setBio(value);
                setSaveData(true);
              }}
              onCancel={cancel}
              attributes={{ name: "bio-input", id: 1 }}
              value={bio || "bio"}
              displayComponent={<EditTextDisplay variant="small" />}
              saveButtonLabel={<CheckIcon className="h-4 w-4" />}
              cancelButtonLabel={<XMarkIcon className="h-4 w-4" />}
            />
          </AccordionBody>
        </Accordion>
        <Accordion
          open={expandContact}
          icon={<Icon id={2} open={expandContact} />}
        >
          <AccordionHeader onClick={() => setExpandContact(!expandContact)}>
            Contact
          </AccordionHeader>
          <AccordionBody>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <DevicePhoneMobileIcon className="h-6 w-6" />
                <BasicInput value={phone} onChange={setPhone} />
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-6 w-6" />
                <BasicInput value={email} onChange={setEmail} />
              </div>
              <div className="flex items-center gap-2">
                <LinkedinIcon className="h-6 w-6" />
                <BasicInput value={linkedin} onChange={setLinkedin} />
              </div>
            </div>
          </AccordionBody>
        </Accordion>
      </div>
    </div>
  );
};
