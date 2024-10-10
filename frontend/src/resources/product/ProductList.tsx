import {
  CreateButton,
  Datagrid,
  FilterButton,
  FilterForm,
  FunctionField,
  List,
  ListActions,
  SearchInput,
  TextField,
} from "react-admin";

import { Stack } from '@mui/material';

const productFilters = [
  <SearchInput source="name" alwaysOn />,
];

const ListToolbar = () => (
  <Stack direction="row" justifyContent="space-between">
      <FilterForm filters={productFilters} />
      <div>
          <FilterButton filters={productFilters} />
          <CreateButton />
      </div>
  </Stack>
)

export const ProductList = () => (
  <List actions={<ListActions hasCreate />}>
    {/* <ListToolbar /> */}
    <Datagrid>
      <TextField source="id"  />
      <TextField source="name" />
      <TextField source="description" />
      <TextField source="category" />
      <FunctionField
        source="price"
        render={(record) => `${"$"} ${record.price}`}
      />
      <TextField source="imageUrl" />
    </Datagrid>
  </List>
);
