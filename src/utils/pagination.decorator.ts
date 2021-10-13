import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationResponse } from './pagination.response';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  description?: string,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        title: `PaginationResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PaginationResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
      description,
    }),
  );
};
