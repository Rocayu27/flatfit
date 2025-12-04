// src/screens/Profile.tsx (React Native)

import React, { useState, useEffect } from "react";
import { MOCK_USER_ID } from "../../lib/mockUser";
import { getProfile, ProfileRecord } from "../../lib/profiles";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch as RNSwitch,
  Modal,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Home,
  GraduationCap,
  Calendar,
  DollarSign,
  Heart,
  Bell,
  RotateCcw,
  Phone,
  AtSign,
} from "lucide-react-native";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/Avatar";

type TabKey = "posts";

type ProfileProps = {
  onEditProfile: () => void;
};

export function Profile({ onEditProfile }: ProfileProps)  {
  const [isVisibleForRoommates, setIsVisibleForRoommates] = useState(true);
  const [showVisibilityDialog, setShowVisibilityDialog] = useState(false);
  const [pendingVisibilityState, setPendingVisibilityState] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("posts");

  const handleResetOnboarding = () => {
    Alert.alert(
      "Reset welcome screen",
      "In the native app, this would clear your onboarding status so you can see the welcome flow again."
    );
  };

  const handleVisibilityChange = (checked: boolean) => {
    if (checked) {
      setPendingVisibilityState(true);
      setShowVisibilityDialog(true);
    } else {
      setIsVisibleForRoommates(false);
    }
  };

  const confirmVisibilityChange = () => {
    setIsVisibleForRoommates(pendingVisibilityState);
    setShowVisibilityDialog(false);
  };

  const cancelVisibilityChange = () => {
    setShowVisibilityDialog(false);
  };

  // Profile data from Supabase
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // still mock for now – later, posts can also come from backend
  const userPosts = [
    {
      id: 1,
      type: "Lease Transfer",
      title: "Modern 2BR Apartment - Study Abroad",
      status: "Active",
      date: "Posted 5 days ago",
      views: 24,
    },
  ];

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const data = await getProfile(MOCK_USER_ID);
        if (isMounted) {
          setProfile(data);
        }
      } catch (e) {
        console.error("Error loading profile", e);
      } finally {
        if (isMounted) {
          setLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // Derive a frontend-friendly userData object (with safe fallbacks)
  const userData = profile
    ? {
        name: `${profile.first_name} ${profile.last_name}`,
        email: "student@rochester.edu", // placeholder until auth
        photo:
          profile.avatar_url ??
           "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        age: profile.age ?? undefined,
        major: profile.major ?? "—",
        year: profile.class_year ? `Class of ${profile.class_year}` : "—",
        housingPreference: profile.housing_preference ?? "—",
        budget: profile.budget_range ?? "—",
        phone: profile.phone ?? "—",
        contactNotes: profile.contact_notes ?? "",
        hobbies: profile.hobbies ?? [],
      }
    : {
        name: loadingProfile ? "Loading..." : "No profile yet",
        email: "student@rochester.edu",
        photo: "",
        age: undefined,
        major: "—",
        year: "—",
        housingPreference: "—",
        budget: "—",
        phone: "—",
        contactNotes: "",
        hobbies: [] as string[],
      };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Avatar + basic info */}
          <View style={styles.profileHeader}>
            <Avatar size={96}>
              {userData.photo ? (
                 <AvatarImage src={userData.photo} />
                ) : (
                  <AvatarFallback>
                    {userData.name ? userData.name.charAt(0) : "?"}
                  </AvatarFallback>
                )}
              </Avatar>
            <View style={styles.profileTextBlock}>
              <Text style={styles.profileName}>{userData.name}</Text>
              <Text style={styles.profileEmail}>{userData.email}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          {/* About Me */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>About Me</Text>

            <View style={styles.infoRow}>
              <GraduationCap size={20} color="#6B7280" />
              <View style={styles.infoTextBlock}>
                <Text style={styles.infoLabel}>Major & Year</Text>
                <Text style={styles.infoValue}>
                  {userData.major} • {userData.year}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Calendar size={20} color="#6B7280" />
              <View style={styles.infoTextBlock}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>
                  {userData.age ? `${userData.age} years old` : "—"}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Home size={20} color="#6B7280" />
              <View style={styles.infoTextBlock}>
                <Text style={styles.infoLabel}>Housing Preference</Text>
                <Text style={styles.infoValue}>
                  {userData.housingPreference}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <DollarSign size={20} color="#6B7280" />
              <View style={styles.infoTextBlock}>
                <Text style={styles.infoLabel}>Budget</Text>
                <Text style={styles.infoValue}>{userData.budget}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Phone size={20} color="#6B7280" />
              <View style={styles.infoTextBlock}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{userData.phone}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <AtSign size={20} color="#6B7280" />
              <View style={styles.infoTextBlock}>
                <Text style={styles.infoLabel}>Contact / Social</Text>
                <Text style={styles.infoValue}>{userData.contactNotes}</Text>
              </View>
            </View>

            <View style={[styles.infoRow, { alignItems: "flex-start" }]}>
              <Heart size={20} color="#6B7280" />
              <View style={styles.infoTextBlock}>
                <Text style={[styles.infoLabel, { marginBottom: 4 }]}>
                  Hobbies & Interests
                </Text>
                <View style={styles.hobbyChips}>
                  {userData.hobbies.length > 0 ? (
                    userData.hobbies.map((hobby) => (
                      <Badge
                        key={hobby}
                        variant="secondary"
                        style={styles.hobby}
                      >
                        {hobby}
                      </Badge>
                    ))
                  ) : (
                    <Text style={styles.helperText}>
                      No hobbies added yet.
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </Card>

          {/* Roommate visibility */}
          <Card style={styles.card}>
            <View style={styles.rowSpaceBetween}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.labelText}>
                  Make my profile visible for finding roommates
                </Text>
                <Text style={styles.helperText}>
                  Let others reach out if you're open to connecting.
                </Text>
              </View>
              <RNSwitch
                value={isVisibleForRoommates}
                onValueChange={handleVisibilityChange}
              />
            </View>
          </Card>

          {/* Connection requests */}
          <Card style={[styles.card, styles.alertCard]}>
            <View style={styles.alertIconCircle}>
              <Bell size={20} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Connection Requests</Text>
              <Text style={styles.helperText}>
                You have 3 pending connection requests
              </Text>
            </View>
            <Badge variant="secondary">3</Badge>
          </Card>

          {/* Tabs (only My Posts now) */}
          <View style={styles.tabsContainer}>
            <View style={styles.tabsList}>
              <TouchableOpacity
                style={[
                  styles.tabTrigger,
                  activeTab === "posts" && styles.tabTriggerActive,
                ]}
                onPress={() => setActiveTab("posts")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "posts" && styles.tabTextActive,
                  ]}
                >
                  My Posts
                </Text>
              </TouchableOpacity>
            </View>

            {/* My Posts content */}
            <View style={styles.tabContent}>
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <Card key={post.id} style={styles.card}>
                    <View style={styles.postHeader}>
                      <View style={{ flex: 1 }}>
                        <View style={styles.postBadgeRow}>
                          <Badge variant="outline">{post.type}</Badge>
                          <Badge
                            variant="secondary"
                            style={styles.statusBadge}
                          >
                            {post.status}
                          </Badge>
                        </View>
                        <Text style={styles.postTitle}>{post.title}</Text>
                        <View style={styles.postMetaRow}>
                          <Text style={styles.postMeta}>{post.date}</Text>
                          <Text style={styles.postMeta}>•</Text>
                          <Text style={styles.postMeta}>
                            {post.views} views
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Card>
                ))
              ) : (
                <Card style={[styles.card, styles.centerCard]}>
                  <Text style={styles.helperText}>
                    You haven't posted anything yet.
                  </Text>
                  <Text style={styles.smallMuted}>
                    Post a lease transfer to get started.
                  </Text>
                </Card>
              )}
            </View>
          </View>

          {/* Edit profile button */}
          <Button style={styles.editButton} size="lg"onPress={onEditProfile}
>
            Edit Profile

          </Button>

          {/* Prototype mode */}
          <Card style={[styles.card, styles.prototypeCard]}>
            <View style={styles.rowSpaceBetween}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <View style={styles.prototypeBadgeRow}>
                  <Badge variant="outline">Prototype Mode</Badge>
                </View>
                <Text style={styles.labelText}>Reset Welcome Screen</Text>
                <Text style={styles.smallMuted}>
                  View the onboarding experience again.
                </Text>
              </View>
              <Button
                variant="outline"
                size="sm"
                style={styles.resetButton}
                onPress={handleResetOnboarding}
              >
                <RotateCcw size={16} />
              </Button>
            </View>
          </Card>
        </ScrollView>

        {/* Visibility confirmation modal */}
        <Modal
          visible={showVisibilityDialog}
          transparent
          animationType="fade"
          onRequestClose={cancelVisibilityChange}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Make your profile visible?</Text>
              <Text style={styles.modalBody}>
                Other students looking for roommates will be able to see your
                profile information and reach out to you. You can turn this off
                at any time.
              </Text>
              <View style={styles.modalButtonsRow}>
                <Button
                  variant="outline"
                  style={[styles.modalButton, { marginRight: 8 }]}
                  onPress={cancelVisibilityChange}
                >
                  Cancel
                </Button>
                <Button
                  style={styles.modalButton}
                  onPress={confirmVisibilityChange}
                >
                  Make Visible
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  profileTextBlock: {
    marginTop: 10,
    alignItems: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileEmail: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  card: {
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoTextBlock: {
    marginLeft: 10,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 14,
  },
  hobbyChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  hobby: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rowSpaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "500",
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
  },
  alertIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(37,99,235,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  tabsContainer: {
    marginTop: 4,
    marginBottom: 12,
  },
  tabsList: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 999,
    padding: 2,
  },
  tabTrigger: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 999,
  },
  tabTriggerActive: {
    backgroundColor: "#2563EB",
  },
  tabText: {
    fontSize: 13,
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  tabContent: {
    marginTop: 10,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: "#DCFCE7",
  },
  postTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  postMetaRow: {
    flexDirection: "row",
    gap: 4,
  },
  postMeta: {
    fontSize: 12,
    color: "#6B7280",
  },
  centerCard: {
    alignItems: "center",
  },
  smallMuted: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
    textAlign: "center",
  },
  editButton: {
    width: "100%",
    marginTop: 4,
    marginBottom: 8,
  },
  prototypeCard: {
    borderStyle: "dashed",
  },
  prototypeBadgeRow: {
    marginBottom: 4,
  },
  resetButton: {
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 14,
    color: "#4B5563",
  },
  modalButtonsRow: {
    flexDirection: "row",
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    height: 40,
  },
});
