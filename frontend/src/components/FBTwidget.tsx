function FBTWidget({ productId }: { productId: string }) {
  const [data, setData] = useState<{ items: any[] }>({ items: [] });
  useEffect(() => {
    getFBT(productId, { limit: 5, preferMargin: true }).then(setData);
  }, [productId]);

  const onClickRec = (pid: string) => {
    // emit rec_click_event via your telemetry hook (Epic C2)
    window.telemetry?.emit("rec_click_event", {
      product_id: productId,
      rec_product_id: pid,
    });
  };

  return (
    <section className="fbt-card">
      <h3 className="card-title">Frequently Bought Together</h3>
      <ul className="fbt-list">
        {data.items.map((i) => (
          <li key={i.product_id} className="fbt-item">
            <img
              src={i.image_url || "/placeholder.png"}
              alt={i.title}
              className="fbt-thumb"
            />
            <div className="fbt-info">
              <div className="fbt-title">{i.title}</div>
              <div className="fbt-price">${i.price.toFixed(2)}</div>
              <button
                className="mini-add-btn"
                onClick={() => {
                  onClickRec(i.product_id);
                  addToCart({ product_id: i.product_id });
                }}
              >
                Add
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="add-all-btn"
        onClick={() => {
          /* add all + PDP */
        }}
      >
        Add all to cart
      </button>
    </section>
  );
}
