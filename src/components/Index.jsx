import React from "react";
import CarouselHomepage from "./CarouselHomepage";
import Catalog from "./catalog/Catalog";
import { Container } from "react-bootstrap";
import RecommendedProducts from "./catalog/RecommendedProducts";
import BestSellers from "./catalog/BestSellers";
import { bem } from "../lib/bem";

// css
import "./../assets/css/page.css";

export default function Index() {
  return (
    <Container className={`${bem("page", "index")}`}>
      <CarouselHomepage />
      <RecommendedProducts />
      <BestSellers />
    </Container>
  );
}
