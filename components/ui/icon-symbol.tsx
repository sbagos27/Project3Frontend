// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Core icons
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'search',

  // Common UI icons
  'person.fill': 'person',              // 👤 person
  'person.2.fill': 'group',             // 👥 multiple people
  'heart.fill': 'favorite',             // ❤️ heart
  'star.fill': 'star',                  // ⭐ star
  'bell.fill': 'notifications',         // 🔔 notifications
  'gearshape.fill': 'settings',         // ⚙️ settings
  'trash.fill': 'delete',               // 🗑️ trash
  'bookmark.fill': 'bookmark',          // 🔖 bookmark
  'plus.circle.fill': 'add-circle',     // ➕ add
  'minus.circle.fill': 'remove-circle', // ➖ remove
  'arrow.backward': 'arrow-back',       // ◀️ back
  'arrow.forward': 'arrow-forward',     // ▶️ forward
  'xmark': 'close',                     // ❌ close

  // 🐱 Cat / Pet related
  'cat.fill': 'pets',           // 🐱 main cat icon
  'pawprint.fill': 'pets',      // 🐾 alternative pet icon
  'cat.circle': 'face',         // 🐱 circular cat-like face (cute option)
  'fish.fill': 'set-meal',      // 🐟 (Material “set-meal” looks like a fish)
  'dog.fill': 'pets',           // 🐶 optional (same “pets” icon)

  // 📸 Instagram-style / Media icons
  'camera.fill': 'photo-camera',   // 📷 camera
  'camera.circle.fill': 'camera-alt', // alternative camera icon
  'video.fill': 'videocam',        // 🎥 video
  'play.rectangle.fill': 'play-circle', // ▶️ play icon
  'square.and.arrow.up': 'share',  // 🔗 share
  'bubble.left.fill': 'chat-bubble', // 💬 comment/message
  'heart.circle.fill': 'favorite', // ❤️ like/heart
  'grid.circle.fill': 'grid-on',   // 🧩 grid / feed view

} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
