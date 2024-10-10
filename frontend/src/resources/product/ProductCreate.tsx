import { Create, NumberInput, SimpleForm, TextInput } from 'react-admin';

export const ProductCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" label="Name"/>
            <TextInput source="description" label="Description" />
            <NumberInput source="price" label="Price"/>
            <TextInput source="imageUrl" label="Image URL"/>
            <TextInput source="category" label="Category"/>
        </SimpleForm>
    </Create>
);
