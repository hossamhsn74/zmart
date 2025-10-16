// import { useEffect, useState } from "react";
// import { getCategories } from "../api/catalogApi";
// import { type Category } from "../types/Category";

// const CategoriesPage = () => {
//   const [categories, setCategories] = useState<Category[]>([]);

//   useEffect(() => {
//     (async () => {
//       const data = await getCategories();
//       setCategories(data);
//     })();
//   }, []);

//   return (
//     <div>
//       <h2>Categories</h2>
//       <nav aria-label="breadcrumb" style={{ marginBottom: "1rem" }}>
//         <ol style={{ display: "flex", listStyle: "none", padding: 0 }}>
//           {categories.map((c, idx) => (
//             <li
//               key={c.id}
//               style={{
//                 background: idx % 2 === 0 ? "#e0f7fa" : "#ffe0b2",
//                 color: "#333",
//                 padding: "0.5rem 1rem",
//                 borderRadius: "16px",
//                 marginRight: idx < categories.length - 1 ? "0.5rem" : 0,
//                 fontWeight: "bold",
//                 display: "flex",
//                 alignItems: "center",
//               }}
//             >
//               {c.name}
//             </li>
//           ))}
//         </ol>
//       </nav>
//     </div>
//   );
// };

// export default CategoriesPage;
