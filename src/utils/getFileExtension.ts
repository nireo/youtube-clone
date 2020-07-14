const getFileExtension = (filename: string): string => {
  const splittedFilename: string[] = filename.split('.');
  return splittedFilename[splittedFilename.length - 1];
};

export default getFileExtension;
