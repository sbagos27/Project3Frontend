// /styles/globalStyles.ts
// /styles/globalStyle.ts
import { StyleSheet } from 'react-native';

export const brandColor = '#417aa9ff'; // Whiskr brand color 🐾

export const globalStyles = StyleSheet.create({
  // Core layout
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },

  // Text styles
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Buttons
  button: {
    backgroundColor: brandColor,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Footer + row utilities
  footerBar: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  // Search styles
  searchContainer: {
    marginBottom: 20,
    backgroundColor: '#417aa9ff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchInput: {
    fontSize: 16,
    color: '#ffffffff',
  },
  resultsContainer: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#417aa9ff',
  },

  // ==== Shared layout helpers for screens ====
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  // ==== Feed / post card styles ====
  postCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  postImage: {
    width: '100%',
    height: 220,
  },
  caption: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  metaText: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    paddingTop: 4,
    fontSize: 12,
    opacity: 0.7,
  },
  headerBrandContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: brandColor,
  },

  headerBrandText: {
    fontSize: 38,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
});
