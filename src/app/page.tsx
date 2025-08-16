import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <main className={styles.main}>
      <Form className={styles.form}>
        <h1>Join Wishlist</h1>
        <Input type="text" placeholder="Name" required />
        <Input type="email" placeholder="Email" required />
        <Button type="submit">Submit</Button>
      </Form>
      {/* TODO: Add additional sections */}
    </main>
  );
}
