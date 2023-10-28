const Card1 = ({ total, title }) => {
  return (
    <div
      className="card-1  d-inline-block rounded
d-flex flex-column gap-2 m-1"
    >
      <p className="">{title || "notgiven"}</p>
      <p className="align-self-end text-secondary">{total || 0}</p>
    </div>
  );
};

export default Card1;
