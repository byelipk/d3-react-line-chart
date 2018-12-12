export const _breakpoints = {
  small: 768,
  medium: 1024,
};
export const _aspectRatioMap = {
  small: 0.4,
  medium: 0.3,
  large: 0.2
};

export function aspectRatio(width) {
  if (width <= _breakpoints.small) {
    return _aspectRatioMap.small;
  }
  else if (width > _breakpoints.small && width <= _breakpoints.medium) {
    return _aspectRatioMap.medium;
  }
  else {
    return _aspectRatioMap.large;
  }
} 