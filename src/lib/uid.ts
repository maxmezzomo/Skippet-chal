//in the context of a larger app there would likely be in place a system to request ids for new entities. To simulate something similar, this function is taken from from https://gist.github.com/gordonbrander/2230317

const uid = () => {
  let a = new Uint32Array(3);
  window.crypto.getRandomValues(a);
  return (
    performance.now().toString(36) +
    Array.from(a)
      .map((A) => A.toString(36))
      .join("")
  ).replace(/\./g, "");
};

export default uid;
