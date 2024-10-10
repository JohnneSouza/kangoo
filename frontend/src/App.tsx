import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { Layout } from "./Layout";
import simpleRestProvider from "ra-data-simple-rest";
import { ProductList } from "./resources/product/ProductList";
import { ProductCreate } from "./resources/product/ProductCreate";

export const App = () => (
  <Admin
    layout={Layout}
    dataProvider={simpleRestProvider("http://localhost:8080")}
  >
    <Resource name="products" list={ProductList} create={ProductCreate} />
  </Admin>
);
