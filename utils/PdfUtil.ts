/* eslint-disable @typescript-eslint/no-explicit-any */
import Jspdf, { AutoPrintInput, DocumentProperties, TextOptionsLight } from "jspdf";
import { useEffect, useState } from "react";
import latoRegular from "@sonamusica-fe/utils/LatoRegular";

type UsePDFHooks = {
  setText: (
    name: string,
    xcoord: number,
    ycoord: number,
    options?: TextOptionsLight | undefined
  ) => void;
  setImage: (
    imageData: string | HTMLImageElement | HTMLCanvasElement | Uint8Array,
    format: string,
    xcoord: number,
    ycoord: number,
    width: number,
    height: number
  ) => void;
  saveToLocal: (filename: string) => void;
  showOutputBlob: () => Blob;
  showOutputBlobUri: () => URL;
  showOutputBuffer: () => ArrayBuffer;
  showOutputUriString: (type: "datauristring" | "dataurlstring") => string;
  showOutputWindow: (type: "dataurlnewwindow" | "pdfobjectnewwindow" | "pdfjsnewwindow") => Window;
  addFont: (
    postScriptName: string,
    id: string,
    fontStyle: string,
    fontWeight?: string | number | undefined
  ) => void;
  setFont: (
    fontName: string,
    fontStyle?: string | undefined,
    fontWeight?: string | number | undefined
  ) => void;
  setFontSize: (size: number) => void;
  setFontColor: (r: number, g: number, b: number) => void;
  print: (options?: AutoPrintInput | undefined) => void;
  utilGetPageWidth: () => number;
  utilGetPageHeight: () => number;
  resetDoc: () => void;
  setProperties: (properties: DocumentProperties) => void;
  addPage: () => void;
  splitText: (text: string, len: number, options?: any) => any;
  utilGetWordLength: (text: string, options?: any) => number;
  utilGetFontList: () => void;
  save: (filename: string) => void;
};

const usePDF = (
  orientation: "p" | "portrait" | "l" | "landscape" | undefined = "p",
  unit: "pt" | "px" | "in" | "mm" | "cm" | "ex" | "em" | "pc" | undefined = "mm",
  papersize: string | number[] = "a4"
): UsePDFHooks => {
  const [doc, setDoc] = useState<Jspdf>(new Jspdf(orientation, unit, papersize));

  useEffect(() => {
    doc.addFileToVFS("ChaparralPro-Regular-normal.ttf", latoRegular);
    doc.addFont("ChaparralPro-Regular-normal.ttf", "ChaparralPro-Regular", "normal");
    doc.setFontSize(13);
    doc.setFont("ChaparralPro-Regular");
  }, [doc]);

  const setText = (
    name: string,
    xcoord: number,
    ycoord: number,
    options?: TextOptionsLight | undefined
  ): void => {
    doc.text(name, xcoord, ycoord, options);
  };

  const setImage = (
    imageData: string | HTMLImageElement | HTMLCanvasElement | Uint8Array,
    format: string,
    xcoord: number,
    ycoord: number,
    width: number,
    height: number
  ): void => {
    doc.addImage(imageData, format, xcoord, ycoord, width, height);
  };

  const saveToLocal = (filename: string): void => {
    doc.save(filename);
  };

  const showOutputBlobUri = (): URL => {
    return doc.output("bloburi");
  };

  const showOutputBlob = (): Blob => {
    return doc.output("blob");
  };

  const showOutputBuffer = (): ArrayBuffer => {
    return doc.output("arraybuffer");
  };

  const showOutputUriString = (type: "datauristring" | "dataurlstring"): string => {
    return doc.output(type);
  };

  const showOutputWindow = (
    type: "dataurlnewwindow" | "pdfobjectnewwindow" | "pdfjsnewwindow"
  ): Window => {
    return doc.output(type);
  };

  const addFont = (
    postScriptName: string,
    id: string,
    fontStyle: string,
    fontWeight?: string | number | undefined
  ): void => {
    doc.addFont(postScriptName, id, fontStyle, fontWeight);
  };

  const setFont = (
    fontName: string,
    fontStyle?: string | undefined,
    fontWeight?: string | number | undefined
  ): void => {
    doc.setFont(fontName, fontStyle, fontWeight);
  };

  const setFontSize = (size: number): void => {
    doc.setFontSize(size);
  };

  const setFontColor = (r: number, g: number, b: number): void => {
    doc.setTextColor(r, g, b);
  };

  const print = (options?: AutoPrintInput | undefined): void => {
    doc.autoPrint(options);
  };

  const utilGetPageWidth = (): number => {
    return doc.internal.pageSize.getWidth();
  };

  const utilGetPageHeight = (): number => {
    return doc.internal.pageSize.getHeight();
  };

  const resetDoc = (): void => {
    setDoc(new Jspdf(orientation, unit, papersize));
  };

  const setProperties = (properties: DocumentProperties): void => {
    doc.setProperties(properties);
  };

  const addPage = (): void => {
    doc.addPage(undefined, orientation);
  };

  const splitText = (text: string, len: number, options?: any): any => {
    return doc.splitTextToSize(text, len, options);
  };

  const utilGetWordLength = (text: string, options?: any): number => {
    return doc.getStringUnitWidth(text, options);
  };

  const utilGetFontList = (): void => {
    doc.getFontList();
  };

  const save = (filename: string): void => {
    doc.save(filename);
  };

  return {
    setText,
    setImage,
    saveToLocal,
    showOutputBlob,
    showOutputBlobUri,
    showOutputBuffer,
    showOutputUriString,
    showOutputWindow,
    addFont,
    setFont,
    setFontSize,
    setFontColor,
    print,
    utilGetPageWidth,
    utilGetPageHeight,
    resetDoc,
    setProperties,
    addPage,
    splitText,
    utilGetWordLength,
    utilGetFontList,
    save
  };
};

export default usePDF;
