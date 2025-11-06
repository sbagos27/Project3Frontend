import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles, brandColor } from '@/styles/globalStyle';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SelectCatScreen() {
  const router = useRouter();

  // Mocked profile list (replace with real data later)
  const [cats, setCats] = useState<string[]>(['LeBron', 'Patches']);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const options = [...cats, 'Add cat profile'];

  const onSelect = (value: string) => {
    setMenuOpen(false);
    if (value === 'Add cat profile') {
      setShowAddModal(true);
      return;
    }
    // (Optional) set active cat in global state here
    router.replace('/home');
  };

  const onAddCat = () => {
    const name = newCatName.trim();
    if (!name) return;
    setCats((prev) => [...prev, name]);
    setShowAddModal(false);
    setNewCatName('');
    // (Optional) set active cat in global state here
    router.replace('/home');
  };

  return (
    <View style={[globalStyles.container, { alignItems: 'stretch' }]}>
      <Text style={[globalStyles.title, { textAlign: 'center' }]}>
        Choose a Cat Profile
      </Text>

      {/* Dropdown trigger */}
      <Pressable
        onPress={() => setMenuOpen((s) => !s)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 12,
          paddingVertical: 12,
          paddingHorizontal: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fff',
        })}
      >
        <Text style={{ fontSize: 16 }}>Select a cat…</Text>
        <IconSymbol name="chevron.right" size={20} color="#222" />
      </Pressable>

      {/* Dropdown menu (simple inline list) */}
      {menuOpen && (
        <View
          style={{
            marginTop: 10,
            borderWidth: 1,
            borderColor: '#eee',
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: '#fff',
          }}
        >
          {options.map((opt, idx) => (
            <Pressable
              key={opt + idx}
              onPress={() => onSelect(opt)}
              style={({ pressed }) => ({
                paddingVertical: 12,
                paddingHorizontal: 14,
                backgroundColor: pressed ? '#f7f7f7' : '#fff',
                borderTopWidth: idx === 0 ? 0 : 1,
                borderTopColor: '#eee',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              })}
            >
              <Text style={{ fontSize: 16 }}>
                {opt}
              </Text>
              {opt === 'Add cat profile' ? (
                <IconSymbol name="plus.circle.fill" size={20} color={brandColor} />
              ) : (
                <IconSymbol name="cat.fill" size={20} color={brandColor} />
              )}
            </Pressable>
          ))}
        </View>
      )}

      {/* Add cat modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              width: '100%',
              borderRadius: 16,
              backgroundColor: '#fff',
              padding: 16,
              gap: 12,
            }}
          >
            <Text style={[globalStyles.title, { marginBottom: 8 }]}>
              Add Cat Profile
            </Text>

            <TextInput
              value={newCatName}
              onChangeText={setNewCatName}
              placeholder="Enter cat's name"
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 12,
                fontSize: 16,
                backgroundColor: '#fff',
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'flex-end',
                marginTop: 8,
              }}
            >
              <Pressable
                onPress={() => {
                  setShowAddModal(false);
                  setNewCatName('');
                }}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                })}
              >
                <Text style={{ fontSize: 16, color: '#666' }}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={onAddCat}
                style={({ pressed }) => [
                  globalStyles.button,
                  {
                    opacity: pressed ? 0.8 : 1,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                  },
                ]}
              >
                <Text style={globalStyles.buttonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
