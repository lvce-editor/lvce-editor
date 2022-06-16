import * as Exec from "../Exec/Exec.js";

const getXzOptions = () => {
  if (process.env.HIGHEST_COMPRESSION) {
    console.info("[info] using highest compression, this may take some time");
    return `-9e T0`; // use highest compression and multiple processors
  }
  return "-1 -T0"; // use low compression and multiple processors
};

/**
 *
 * @param {string} inDir
 * @param {string} outFile
 * @param {import('execa').Options} options
 */
export const tarXz = async (inDir, outFile, options) => {
  const xzOptions = getXzOptions();
  await Exec.exec("tar", ["cfJ", outFile, inDir], {
    ...options,
    env: {
      ...options.env,
      XZ_OPT: xzOptions,
    },
  });
};

/**
 *
 *
 * @param {string} inDir
 * @param {string} outFile
 * @param {import('execa').Options} options
 */
export const tar = async (inDir, outFile, options) => {
  await Exec.exec("tar", ["cf", outFile, inDir], options);
};
/**
 *
 * @param {string} inFile
 * @param {import('execa').Options} options
 */
export const xz = async (inFile, options) => {
  // https://stackoverflow.com/questions/22244962/multiprocessor-support-for-xz
  await Exec.exec("xz", ["-1", "-T0", inFile], options);
};

/**
 *
 * @param {string} inDir
 * @param {string} outFile
 * @param {import('execa').Options} options
 */
export const tarAdd = async (inDir, outFile, options) => {
  await Exec.exec("tar", ["rf", outFile, inDir], options);
};

/**
 *
 * @param {string} controlArchive
 * @param {string} dataArchive
 * @param {import('execa').Options} options
 */
export const deb = async (controlArchive, dataArchive, options) => {
  await Exec.exec(
    "ar",
    ["r", "app.deb", "debian-binary", controlArchive, dataArchive],
    options
  );
};
