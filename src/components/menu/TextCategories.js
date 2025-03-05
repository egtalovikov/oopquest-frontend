export default function TextCategories({ room }) {
  if (!room.categories) return "";

  let roomsString = "";

  let first = true;
  room.categories.forEach((cat) => {
    if (cat.active === true) {
      if (!first) {
        roomsString += ", ";
      }
      roomsString += cat.name;
      first = false;
    }
  });

  return roomsString;
}
