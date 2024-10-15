package dev.kangoo.mappers;

import dev.kangoo.domain.product.ProductEntity;
import dev.kangoo.domain.product.ProductRequest;
import dev.kangoo.domain.product.ProductResponse;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ProductMapper {

    ProductMapper INSTANCE = Mappers.getMapper( ProductMapper.class );

    ProductEntity mapToEntity(ProductRequest request);

    ProductResponse mapToResponse(ProductEntity entity);
}
