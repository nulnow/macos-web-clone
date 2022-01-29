import {IWindowTransform} from '../../models/IWindowTransform';

export const getTransformFromIWindowTransform = (
  transformObj: IWindowTransform
): string | undefined => {
  if (Object.values(transformObj ?? {}).length === 0) {
    return undefined;
  }

  let transform: string = '';

  if (transformObj.x) {
    transform += `translateX(${transformObj.x}px) `;
  }

  if (transformObj.y) {
    transform += `translateY(${transformObj.y}px) `;
  }

  if (transformObj.scaleX) {
    transform += `scaleX(${transformObj.scaleX}) `;
  }

  if (transformObj.scaleY) {
    transform += `scaleY(${transformObj.scaleY})`;
  }

  return transform.trim();
};
