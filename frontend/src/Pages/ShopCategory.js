import React, { useContext, useState } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import Item from "../Components/Item/Item";
const ShopCategory = (props) => {
    const { all_product } = useContext(ShopContext);
    const [search, setSearch] = useState("");
    const [sortOpen, setSortOpen] = useState(false);
    const [sortOption, setSortOption] = useState("newest");
    const filteredProducts = all_product
    .filter((item) => {
        return (
            props.category === item.category &&
            item.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    })
    .sort((a, b) => {
        switch (sortOption) {
            case "low":
                return a.new_price - b.new_price;
            case "high":
                return b.new_price - a.new_price;
            case "az":
                return a.name.localeCompare(b.name);
            case "za":
                return b.name.localeCompare(a.name);
             default:
                return a.id - b.id;
        }
    });
    return (
        <div className="shop-category">
            <img
                className="shopcategory-banner"
                src={props.banner}
                alt=""
            />
            {/* Search */}
            <div className="shopcategory-search">
                <input
                    type="text"
                    placeholder="🔍 Search products..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />
            </div>
            {/* Top Bar */}
            <div className="shopcategory-indexSort">
                <p>
                    <span>
                        Showing {filteredProducts.length}
                    </span>
                    {" "}of{" "}
                    {
                        all_product.filter(
                            item => item.category === props.category
                        ).length
                    }
                    {" "}products
                </p>
                <div className="custom-sort">
                    <div
                        className="sort-selected"
                        onClick={() =>
                            setSortOpen(!sortOpen)
                        }
                    >
                        {sortOption === "newest" && "Newest"}
                        {sortOption === "low" &&
                            "Price: Low to High"}
                        {sortOption === "high" &&
                            "Price: High to Low"}
                        {sortOption === "az" &&
                            "Name: A-Z"}
                        {sortOption === "za" &&
                            "Name: Z-A"}
                        <span
                            className={
                                sortOpen
                                    ? "rotate"
                                    : ""
                            }
                        >
                            ▼
                        </span>
                    </div>
                    {sortOpen && (
                        <div className="sort-dropdown">
                            <div
                                onClick={() => {
                                    setSortOption("newest");
                                    setSortOpen(false);
                                }}
                            >
                                Newest
                            </div>
                            <div
                                onClick={() => {
                                    setSortOption("low");
                                    setSortOpen(false);
                                }}
                            >
                                Price: Low to High
                            </div>
                            <div
                                onClick={() => {
                                    setSortOption("high");
                                    setSortOpen(false);
                                }}
                            >
                                Price: High to Low
                            </div>
                            <div
                                onClick={() => {
                                    setSortOption("az");
                                    setSortOpen(false);
                                }}
                            >
                                Name: A-Z
                            </div>
                            <div
                                onClick={() => {
                                    setSortOption("za");
                                    setSortOpen(false);
                                }}
                            >
                                Name: Z-A
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Products */}
            <div className="shopcategory-products">
              {filteredProducts.length > 0 ? (
                  filteredProducts.map((item) => (
                      <Item
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          image={item.image}
                          new_price={item.new_price}
                          old_price={item.old_price}
                          countInStock={item.countInStock}
                      />
                  ))
              ) : (
                  <div className="no-products">
                      <h2>😔 No Products Found</h2>
                      <p>
                          Try searching with another keyword.
                      </p>
                  </div>
              )}
          </div>
            <div className="shopcategory-loadmore">
                Explore More
            </div>
        </div>
    );
};
export default ShopCategory;