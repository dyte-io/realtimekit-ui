import { h, FunctionalComponent, Host } from '@stencil/core';
import { Meeting } from '../../types/rtk-client';
import { Size, States } from '../../types/props';
import { UIConfig } from '../../types/ui-config';
import { Element } from '../../types/ui-config/root';
import { computeSelectors, getComputedChildren, getComputedStyles } from './utils';
import { IconPack } from '../icons';
import { RtkI18n } from '../lang';

export interface DefaultProps {
  meeting: Meeting;
  config: UIConfig;
  size: Size;
  states: States;
  iconPack: IconPack;
  t: RtkI18n;
}

export interface Props {
  [prop: string]: any;
}

interface RenderChildrenProps {
  elements: Element[];
  defaults: DefaultProps;
  props?: Props;
  deepProps?: boolean;
  elementProps?: Props;
}

/**
 * Renders the children of an element.
 */
export const RenderChildren: FunctionalComponent<RenderChildrenProps> = ({
  elements,
  defaults,
  props = {},
  deepProps = false,
  elementProps = {},
}) => {
  if (!Array.isArray(elements) || elements.length === 0) return null;
  return elements.map((element) => {
    return (
      <Render
        element={element}
        defaults={defaults}
        props={props}
        childProps={deepProps && props}
        elementProps={elementProps}
      />
    );
  });
};

interface RenderProps {
  element: Element;
  defaults: DefaultProps;
  props?: Props;
  childProps?: Props;
  onlyChildren?: boolean;
  asHost?: boolean;
  deepProps?: boolean;
  elementProps?: Props;
}

export const lenChildren = ({ element, defaults, props = {}, elementProps = {} }: RenderProps) => {
  const { config, size, states } = defaults;

  let Tag,
    configProps = {},
    configChildren = [];

  if (Array.isArray(element)) {
    // get props if element is passed in array form:
    // ['rtk-participant-tile', { variant: 'gradient' }]
    [Tag, configProps, ...configChildren] = element;
  } else {
    Tag = element;
  }

  const elemData = config?.root?.[Tag];
  if (elemData != null && 'props' in elemData) {
    props = { ...elemData['props'], ...props };
  }

  props = { ...props, ...configProps };

  if (Tag in elementProps) {
    props = { ...props, ...elementProps[Tag] };
  }

  const selectors = computeSelectors({ element: Tag, size, states, config });
  const computedChildren = getComputedChildren({ selectors, root: config.root });

  return computedChildren.length;
};

/**
 * Renders an element from UI Config
 */
export const Render: FunctionalComponent<RenderProps> = (
  {
    element,
    defaults,
    childProps = {},
    props = {},
    onlyChildren = false,
    asHost = false,
    deepProps = false,
    elementProps = {},
  },
  children
) => {
  const { config, size, states } = defaults;

  let Tag,
    configProps = {},
    configChildren = [];

  if (Array.isArray(element)) {
    // get props if element is passed in array form:
    // ['rtk-participant-tile', { variant: 'gradient' }]
    [Tag, configProps, ...configChildren] = element;
  } else {
    Tag = element;
  }

  const elemData = config?.root?.[Tag];
  if (elemData != null && 'props' in elemData) {
    props = { ...elemData['props'], ...props };
  }

  props = { ...props, ...configProps };

  if (Tag in elementProps) {
    props = { ...props, ...elementProps[Tag] };
  }

  const selectors = computeSelectors({ element: Tag, size, states, config });
  const computedChildren = getComputedChildren({ selectors, root: config.root });

  if (onlyChildren) {
    return (
      <RenderChildren
        elements={computedChildren}
        defaults={defaults}
        props={childProps}
        deepProps={deepProps}
        elementProps={elementProps}
      />
    );
  }

  const styles = getComputedStyles({ selectors, styles: config.styles });

  if (asHost) {
    return (
      <Host {...defaults} style={styles} {...props}>
        <RenderChildren
          elements={computedChildren}
          defaults={defaults}
          props={childProps}
          deepProps={deepProps}
          elementProps={elementProps}
        />

        {children}

        {/* Supports children passed from config */}
        {configChildren.map((child) => {
          if (Array.isArray(child)) {
            const [Tag, props] = child;
            return <Tag {...defaults} {...props} />;
          }
          return child;
        })}
      </Host>
    );
  }

  if (['rtk-header', 'rtk-controlbar'].includes(Tag)) {
    props['disableRender'] = true;
  }

  if (Tag.startsWith('rtk-')) {
    return (
      <Tag {...defaults} style={styles} {...props}>
        <RenderChildren
          elements={computedChildren}
          defaults={defaults}
          props={childProps}
          deepProps={deepProps}
          elementProps={elementProps}
        />

        {children}

        {/* Supports children passed from config */}
        {configChildren.map((child) => {
          if (Array.isArray(child)) {
            const [Tag, props] = child;
            return <Tag {...defaults} {...props} />;
          }
          return child;
        })}
      </Tag>
    );
  } else {
    const [HTMLTag, id] = Tag.split('#');
    return (
      <HTMLTag id={id} style={styles} {...props}>
        <RenderChildren
          elements={computedChildren}
          defaults={defaults}
          props={childProps}
          deepProps={deepProps}
          elementProps={elementProps}
        />
        {children}

        {/* Supports children passed from config */}
        {configChildren.map((child) => {
          if (Array.isArray(child)) {
            const [Tag, props] = child;
            return <Tag {...defaults} {...props} />;
          }
          return child;
        })}
      </HTMLTag>
    );
  }
};
