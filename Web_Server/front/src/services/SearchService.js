import axios from 'axios';

const SearchVideoByName = async (name) => {
  let res;
  await axios
    .get('http://127.0.0.1:5050/searchVideoByName?name=' + name)
    .then((r) => {
      console.log(r.data);
      res = r;
    });
  // if()
  return res.data;
};

const SearchVideoByID = async (id) => {
  let res;
  console.log(id);
  await axios
    .get('http://127.0.0.1:5050/videoById', { params: { id: id } })
    .then((r) => {
      // console.log(r.data);
      res = r;
    });
  // if()
  return res.data;
};

const SearchVideosByTag = async (tag) =>{
    let res;
    // console.log(id);
    await axios.get("http://127.0.0.1:5050/videosByTag", { params: { tag: tag } }).then(
        (r) => {
            // console.log(r.data);
            res= r;    
        }
    );
    // if()
    return res.data;

};

export {SearchVideoByName,SearchVideoByID,SearchVideosByTag};